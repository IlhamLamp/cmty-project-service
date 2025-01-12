import {
  Logger as BaseLogger,
  type IMeta,
  type ISettingsParam,
  type ILogObj,
} from "tslog";
import { z } from "zod";
import { tracer } from "./requestId";

export const nodeEnv = z
  .enum(["development", "staging", "test", "production"])
  .catch("development");
export type NODE_ENV = z.infer<typeof nodeEnv>;
function getPrettyLogTemplate(env: NODE_ENV) {
  const TEMPLATE: Record<NODE_ENV, string> = {
    development: "{{logLevelName}}|{{name}}|{{requestId}} || ",
    staging: "{{logLevelName}}|{{name}}|{{requestId}} || ",
    test: "{{logLevelName}}|{{name}}|{{requestId}} || ",
    production: "{{logLevelName}}|{{name}}|{{requestId}} || ",
  };

  return TEMPLATE[env];
}

function createLogger<LogObj extends ILogObj = ILogObj>(
  opts: ISettingsParam<LogObj> & { env: NODE_ENV },
  logObj?: LogObj
) {
  const { env } = opts;
  return new BaseLogger(
    {
      minLevel: 0,
      name: "CORE",
      type: "pretty",
      hideLogPositionForProduction: true,
      prettyLogTemplate: getPrettyLogTemplate(env),
      overwrite: {
        addPlaceholders: (
          logObjMeta: IMeta,
          placeholderValues: Record<string, string | number>
        ) => {
          placeholderValues["requestId"] = (tracer.id() as string) || "-";
        },
        mask: (args: unknown[]): unknown[] => {
          if (env != "development") {
            if (args[1]) {
              try {
                args[1] = JSON.stringify(args[1]);
              } catch (error) {}
            }
          }
          return args;
        },
      },
      stylePrettyLogs: false,
      prettyLogTimeZone: "UTC",
      ...opts,
    },
    logObj
  );
}

export { createLogger };
