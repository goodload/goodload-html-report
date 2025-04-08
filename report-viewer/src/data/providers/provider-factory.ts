import {Provider} from "./provider";
import {MockProvider} from "./mock-provider";

export class ProviderFactory {
    public static buildProvider(): Provider {
        return new MockProvider();
    }
}