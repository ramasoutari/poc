import { Helmet } from 'react-helmet-async';
import ServicesListView from '../../../sections/services/view/services-list-view';
// sections

// ----------------------------------------------------------------------

export default function ServicesListPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Services</title>
      </Helmet>

      <ServicesListView />
    </>
  );
}
