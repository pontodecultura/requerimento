/**
 * EventBus: implementação pequena do padrão Observer (Publicador/Assinante).
 * Os componentes podem reagir a mudanças sem ficarem acoplados entre si.
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
    this.listeners.get(eventName).add(callback);
    return () => this.unsubscribe(eventName, callback);
  }

  unsubscribe(eventName, callback) {
    this.listeners.get(eventName)?.delete(callback);
  }

  publish(eventName, payload) {
    this.listeners.get(eventName)?.forEach((callback) => callback(payload));
  }
}
