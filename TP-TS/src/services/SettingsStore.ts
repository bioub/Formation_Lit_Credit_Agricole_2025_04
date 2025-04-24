import { Store } from "../lib/rlx-lit";

interface SettingsState {
  title: string;
}

export class SettingsStore extends Store {
  state: SettingsState = {
    title: "My App",
  };

  updateTitle(title: string): void {
    this.state.title = title;
    this.requestUpdate();
  }
}
