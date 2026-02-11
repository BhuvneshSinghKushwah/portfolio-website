import { UAParser } from "ua-parser-js";

interface ParsedUA {
  device_type: string;
  browser: string;
  os: string;
}

/** Parses a user-agent string and returns device type, browser name, and OS name. */
export function parseUserAgent(ua: string | null): ParsedUA {
  if (!ua) return { device_type: "unknown", browser: "unknown", os: "unknown" };

  const parser = new UAParser(ua);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    device_type: device.type || "desktop",
    browser: browser.name || "unknown",
    os: os.name || "unknown",
  };
}
