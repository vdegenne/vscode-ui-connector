import fs from "fs";
import _getPort from "get-port";
import {
  CACHED_DIRECTORY,
  CACHED_PORT_FILEPATH,
  DEFAULT_CONFIG,
} from "./constants.js";
import { convertToWindowsPathIfNecessary } from "./path.js";

export const CONFIG_FILENAME = ".vuc.json";

export interface ServerOptions {
  /**
   * Port to use for the connector server.
   */
  port: number;
  /**
   * Files to include in the grep searches.
   */
  include: string | string[];
}

/**
 * Returns user-defined config or null if not found.
 */
export function getUserConfig(): Partial<ServerOptions> | null {
  try {
    const fileContent = fs.readFileSync(CONFIG_FILENAME);
    return JSON.parse(fileContent.toString());
  } catch (e) {
    return null;
  }
}

/**
 * Returns the config made from combining user-defined config and default values.
 */
export function getComposedConfig(): ServerOptions {
  return {
    // default
    ...DEFAULT_CONFIG,
    // config
    ...(getUserConfig() ?? {}),
  };
}

export async function resolvePort(): Promise<number> {
  let port: number;
  // We resolve the port value following these priorities
  // 1. User-defined port
  const config = getUserConfig();
  if (config && config.port) {
    return config.port;
  }

  // 2. Cached port (DEPRECATED)
  const portFilePath = convertToWindowsPathIfNecessary(CACHED_PORT_FILEPATH);
  if (fs.existsSync(portFilePath)) {
    port = parseInt(fs.readFileSync(CACHED_PORT_FILEPATH).toString());
  }

  // 3. Get a random port
  if (port === undefined) {
    port = await _getPort();
  }

  // Cache the port
  if (!fs.existsSync(CACHED_DIRECTORY)) {
    await fs.promises.mkdir(CACHED_DIRECTORY);
  }
  // fs.promises.writeFile(CACHED_PORT_FILEPATH, `${port}`);
  fs.promises.writeFile(CONFIG_FILENAME, JSON.stringify({ port }, null, 2));

  return port;
}
