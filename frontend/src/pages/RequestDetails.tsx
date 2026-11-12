import { useParams } from "react-router-dom";
import Page from "../components/common/Page";
export default function RequestDetails() {
  const { requestId } = useParams();
  return <Page title={`Request ${requestId ?? ""}`} description="Request details, decision history, and requested access." />;
}
