/**
 * Throwed when callback setting computation needs to be interrupted. In that case
 * the exception will be caught and next stages won't be computed.
 */
export default class Interruption extends Error {}
