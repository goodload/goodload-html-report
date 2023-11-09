import mysql, {RowDataPacket} from "mysql2/promise";
import {StepDef, SimulationMetadata, StepMetrics} from "../dtos/dtos";

export class MySQLProvider {
    private pool: mysql.Pool;

    private viewsCreated: boolean = false

    public constructor(config: mysql.PoolOptions = {
        host: 'localhost',
        user: 'root',
        database: 'goodload',
        password: '',
        port: 3306
    }) {
        console.log('MySQLProvider connecting to ' + config.host + ':' + config.port + '/' + config.database);
        this.pool = mysql.createPool(config);

        this.createViews();

    }

    public async loadSimulationStructure(): Promise<SimulationMetadata> {
        const [results, fields] = await this.pool.execute('SELECT * FROM simulation_structure LIMIT 1;');

        const rows = results as any as RowDataPacket[];

        if (rows.length <= 0) {
            throw new Error("No simulation found in datasource")
        }

        return {
            id: rows[0].id,
            name: rows[0].name
        };
    }

    public async getStepsGraph(): Promise<StepDef[]> {
        const [rootStepsResults] = await this.pool.execute('SELECT * FROM action_metadata WHERE parent IS NULL;');
        const rows = rootStepsResults as any as RowDataPacket[];

        const stepDefs: StepDef[] = [];

        for (const row of rows) {
            const childrenOfStep = await this.getSubStepsGraph(row.id);
            stepDefs.push({
                id: row.id,
                name: row.name,
                subSteps: childrenOfStep
            })
        }
        return stepDefs;
    }

    private async getSubStepsGraph(parentStepId: number): Promise<StepDef[]> {
        const [subStepResults] = await this.pool.execute('SELECT * FROM action_metadata WHERE parent = ?;', parentStepId);

        const rows = subStepResults as any as RowDataPacket[];

        let subSteps: StepDef[] = [];

        for (const row of rows) {
            const childrenOfStep = await this.getSubStepsGraph(row.id);

            subSteps.push({
                id: row.id,
                name: row.name,
                subSteps: childrenOfStep
            })
        }

        return subSteps
    }

    private async getMetricsForStepId(stepId: string, startTimestamp: number, endTimestamp: number): Promise<StepMetrics> {
        const [avgIterationTime, percentile95ExecutionTime, percentile99ExecutionTime] = await Promise.all([
            this.getAverageExecutionTimeForStepId(stepId, startTimestamp, endTimestamp),
            this.getPercentileExecutionTimeForStepId(stepId, startTimestamp, endTimestamp, 0.95),
            this.getPercentileExecutionTimeForStepId(stepId, startTimestamp, endTimestamp, 0.99)]);

        return {
            stepId: stepId,
            avgIterationTime: avgIterationTime,
            percentile95ExecutionTime: percentile95ExecutionTime,
            percentile99ExecutionTime: percentile99ExecutionTime
        }
    }

    private async getPercentileExecutionTimeForStepId(stepId: string, startTimestamp: number, endTimestamp: number, percentile: number): Promise<number> {
        const [percentileExecutionTimeResult] = await this.pool.execute(
            `SELECT DISTINCT first_value(my_column) OVER (
              ORDER BY CASE WHEN perc_rank <= ? THEN perc_rank END DESC /* NULLS LAST */
            ) perc_value,
            FROM action_report_view
            WHERE step_id = ? AND start_timestamp_in_millis >= ? AND end_timestamp_in_millis <= ?;`,
            [percentile, stepId, startTimestamp, endTimestamp]
        )

        const rows = percentileExecutionTimeResult as any as RowDataPacket[];

        return parseInt(rows[0].perc_value)
    }

    private async getAverageExecutionTimeForStepId(stepId: string, startTimestamp: number, endTimestamp: number): Promise<number> {
        const [percentileExecutionTimeResult] = await this.pool.execute(
            `SELECT AVG(iteration_execution_time) AS avg_iteration_execution_time,
            FROM action_report_view
            WHERE step_id = ? AND start_timestamp_in_millis >= ? AND end_timestamp_in_millis <= ?;`,
            [stepId, startTimestamp, endTimestamp]
        )

        const rows = percentileExecutionTimeResult as any as RowDataPacket[];

        return parseInt(rows[0].perc_value)
    }

    private createViews() {
        // Create view to calculate endtimestamp - starttimestamp = total_time
        let actionReportViewCreated = false

        this.pool.execute(`
                CREATE VIEW action_report_view AS 
                SELECT 
                    *, 
                    percent_rank() OVER (ORDER BY iteration_execution_time) perc_rank 
                    FROM (
                        SELECT 
                            *, 
                            (end_timestamp_in_millis - start_timestamp_in_millis) AS iteration_execution_time 
                        FROM action_report
                    ) AS s;
            `)
            .then(() => {
                actionReportViewCreated = true
                console.debug('action_report_view created')
            }).catch(error => console.error(error));

        if (actionReportViewCreated) {
            this.viewsCreated = true;
        }
    }
}