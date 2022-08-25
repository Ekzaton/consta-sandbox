import {Theme, presetGpnDefault} from "@consta/uikit/Theme";

import Form from "./components/Form/Form";

export default function App() {
  return (
      <Theme preset={presetGpnDefault}>
        <Form/>
      </Theme>
  );
}
