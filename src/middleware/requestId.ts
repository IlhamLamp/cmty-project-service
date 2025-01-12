import clsTracer from "cls-rtracer";

const KEY_HEADER = "X-Request-Id";

export { clsTracer as tracer };

export function initRequestId() {
  return clsTracer.expressMiddleware({
    headerName: KEY_HEADER,
    useHeader: true,
    echoHeader: true,
  });
}
