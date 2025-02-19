import { Helmet } from 'react-helmet-async';
import SettingsView from '../../../sections/settings/view/settings-view';
// sections

// ----------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Settings</title>
      </Helmet>

      <SettingsView />
    </>
  );
}
