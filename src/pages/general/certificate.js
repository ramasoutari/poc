import { Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { HOST_API } from '../../config-global';
import { useSearchParams } from '../../routes/hooks';

function Certificate() {
  const [certFileId, setCertFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = useSearchParams();
  const certID = useMemo(() => {
    return query.get('certID');
  }, [query]);
  const type = useMemo(() => {
    return query.get('type') ? query.get('type') : null;
  }, [query]);

  return (
    <div>
      {!certID && <Box>Certificate Not Found</Box>}

      {certID && (
        <Box pt={2}>
          <iframe
            src={
              type ? `${HOST_API}/attachment-cpd/${certID}` : `${HOST_API}/GetAttachment/${certID}`
            }
          />
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
