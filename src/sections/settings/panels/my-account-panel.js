// @mui
import { Button, Stack, Typography } from '@mui/material';
// hooks
// components
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from '../../../locales';
//

// ----------------------------------------------------------------------

export default function MyAccountPanel() {
  const { user } = useAuthContext();

  const { t } = useLocales();

  return (
    <>
      <Stack direction="column" gap={2}>
        {user?.type === 'RMS' && user?.fullName}
        {user?.type !== 'RMS' && (
          <>
            <Stack direction="row" gap={1}>
              <Typography variant="subtitle1">
                {t['first_name']}: {user?.firstName}{' '}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <Typography variant="subtitle1">
                {t['second_name']}: {user?.fatherName}{' '}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <Typography variant="subtitle1">
                {t['third_name']}: {user?.grandFather}{' '}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <Typography variant="subtitle1">
                {t['last_name']}: {user?.family}{' '}
              </Typography>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
