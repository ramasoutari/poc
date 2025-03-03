import { Box } from "@mui/material";
import axios from "axios";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { HOST_API } from "../../config-global";
import { useSearchParams } from "../../routes/hooks";
import DocViewer, { DocViewerRenderers, PDFRenderer } from "react-doc-viewer";

function Certificate() {
  const [certFileId, setCertFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = useSearchParams();
  const appId = useMemo(() => {
    return query.get("appId");
  }, [query]);
  const type = useMemo(() => {
    return query.get("type") ? query.get("type") : null;
  }, [query]);

  return (
    <div>
      {!appId && <Box>Certificate Not Found</Box>}

      {appId && (
        <Box pt={2}>
          <embed
            src={`${HOST_API}/certificate/${appId}?view=true`}
            type="application/pdf"
            width="100%"
            height="600px"
          />

          {/* <iframe
            style={{
              width: "900px",
              height: "600px",
            }}
            src={`${HOST_API}/certificate/${appId}?view=true`}
          /> */}
        </Box>
      )}
    </div>
  );
}

export default Certificate;

// function VlCertificate() {
//   const [certFileId, setCertFileId] = useState(null)
//   const [loading, setLoading] = useState(false);
//   const query = useSearchParams();
//   const qrCode = useMemo(() => {
//     return query.get('qrCode')
//   }, [query])

//   const validateQRCode = async (qrCode) => {
//     if (!qrCode) return
//     console.log("qrCode", qrCode)
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post(
//         `${HOST_API}/validateQR`,
//         {
//           qrCode: qrCode.replace(" ", "+"),
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         }
//       );

//       setCertFileId(response.data.data?.certFileId)

//       console.log("response", response)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     validateQRCode(qrCode)
//   }, [qrCode])

//   return (
//     <div>
//       {!loading && !certFileId && <Box>
//         Certificate Not Found
//       </Box>}

//       {certFileId && <Box pt={2}>
//         <iframe
//           src={`${HOST_API}/GetAttachment/${certFileId}`}
//         />
//       </Box>}
//     </div>
//   )
// }

// export default VlCertificate
