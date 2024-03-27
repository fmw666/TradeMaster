import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export interface OptionType {
  name: string;
  id: number;
}

export interface MultiInputProps {
  options: OptionType[];
  selectedOptions: OptionType[];
  onInputChange: (selectedOptions: OptionType[]) => void;
}

export default function MultiInput (props: MultiInputProps) {
  const { options, selectedOptions, onInputChange } = props;
  const [open, setOpen] = React.useState(false);
  const [dataOptions, setdataOptions] = React.useState<readonly OptionType[]>([]);
  const loading = open && dataOptions.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setdataOptions([...options]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setdataOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id='multi-input'
      size='small'
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={selectedOptions}
      multiple
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      options={dataOptions}
      loading={loading}
      onChange={(event, value) => onInputChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
