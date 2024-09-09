import { Serenity } from '@serenityjs/serenity';
import { Plugin } from '@serenityjs/plugins';

declare function onInitialize(serenity: Serenity, { logger }: Plugin): void;
declare function onShutdown(_: Serenity, { logger }: Plugin): void;

export { onInitialize, onShutdown };
