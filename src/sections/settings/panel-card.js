import { Box, Card, CardHeader } from '@mui/material';
import PropTypes from 'prop-types';

export default function PanelCard({ title, subtitle, children, isActive, sx, ...other }) {
  return (
    <Card
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        minWidth: '290px',
        boxShadow: 'none',
        opacity: isActive ? 1 : 0.5,
        // if not active prevent pointer events
        pointerEvents: isActive ? 'auto' : 'none',
        userSelect: isActive ? 'auto' : 'none',
        ...sx,
      }}
      {...other}
    >
      <CardHeader
        title={title}
        subheader={subtitle}
        sx={{
          textAlign: 'center',
        }}
      />

      <Box
        mt={2}
        sx={{
          flex: 1,
          '& form ': {
            height: '100%',
          },
        }}
      >
        {children}
      </Box>
    </Card>
  );
}

PanelCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  isActive: PropTypes.bool,
  sx: PropTypes.object,
};
