import { Helmet } from "react-helmet-async";
import MyOrdersView from "../../../sections/view/my-orders-view";

// ----------------------------------------------------------------------

export default function MyOrdersPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: My Applications</title>
      </Helmet>

      <MyOrdersView />
    </>
  );
}

