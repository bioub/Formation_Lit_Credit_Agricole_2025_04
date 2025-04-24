import { Controller } from "../lib/rlx-lit";
import { createContext } from "@lit/context";

interface SettingsState {
  title: string;
}

export class SettingsController extends Controller {
  state: SettingsState = {
    title: "My App",
  };

  updateTitle(title: string): void {
  

    this.state.title = title;
    this.requestUpdate();
  }
}

export const settingsContext = createContext<SettingsController>(Symbol('settings-context'));
