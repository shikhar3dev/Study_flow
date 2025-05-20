import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const premiumBenefits = [
  'Ad-free experience',
  'Unlimited access to all features',
  'Faster response times',
  'Extended history storage',
  'Priority customer support',
  'Exclusive early access to new tools',
];

const freeFeatures = [
  'Basic study planner',
  'AI chat (limited)',
  'Flashcards (limited)',
  'Basic statistics',
];

const PremiumUpsell = ({ onUpgrade }) => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}
  >
    <Paper elevation={6} sx={{ maxWidth: 500, width: '100%', p: 4, borderRadius: 4, textAlign: 'center', position: 'relative' }}>
      <Chip
        icon={<StarIcon sx={{ color: 'gold' }} />}
        label="Premium"
        color="primary"
        sx={{ position: 'absolute', top: 24, right: 24, fontWeight: 'bold', fontSize: 16 }}
      />
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Upgrade to StudyFlow Pro
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Unlock all features and elevate your study experience.
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={1}>
              Free
            </Typography>
            <List dense>
              {freeFeatures.map((feature) => (
                <ListItem key={feature}>
                  <ListItemIcon>
                    <LockOpenIcon color="disabled" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h6" fontWeight="bold" color="primary" mb={1}>
              Premium
            </Typography>
            <List dense>
              {premiumBenefits.map((benefit) => (
                <ListItem key={benefit}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" fontWeight="bold" mb={1}>
        $49.99 <Typography variant="body2" component="span" color="text.secondary">/ year</Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Save 17% with yearly billing. Cancel anytime.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ fontWeight: 'bold', fontSize: 18, py: 1.5 }}
        onClick={onUpgrade}
      >
        Upgrade Now
      </Button>
      <Typography variant="caption" color="grey.500" mt={2} display="block">
        By upgrading, you agree to our Terms of Service.
      </Typography>
    </Paper>
  </Box>
);

export default PremiumUpsell; 