import {
  Grid,
  Icon,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FilterOptionsState,
} from '@material-ui/lab';
import { matchSorter } from 'match-sorter';
import React, {
  ChangeEvent,
  Children,
  cloneElement,
  ComponentType,
  createContext,
  FC,
  forwardRef,
  HTMLAttributes,
  useContext,
} from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { getIconUrlByName, getIconUrlForFilePath } from 'vscode-material-icons';
import { dirnameFromPath, filenameFromPath } from '../utils/format';
import { ICONS_URL } from '../utils/icons';
import { Module } from '../utils/types';

type Props = {
  modules: Module[];
  label: string;
  value?: Module[];
  onChange?: (modules: Module[]) => void;
};

const LISTBOX_PADDING = 8;

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  return cloneElement(data[index], {
    style: {
      ...style,
      top: Number(style.top) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window
const ListboxComponent = forwardRef<HTMLDivElement>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;
    const height = Math.min(itemCount, 8) * itemSize + 2 * LISTBOX_PADDING;

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <FixedSizeList
            itemData={itemData}
            height={height}
            width="100%"
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={itemSize}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </FixedSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  },
);

function renderOption(option: Module) {
  const iconSrc = option.isLocal
    ? getIconUrlForFilePath(option.path, ICONS_URL)
    : getIconUrlByName('npm', ICONS_URL);
  const filename = filenameFromPath(option.path);
  const dirname = dirnameFromPath(option.path);
  const dirnameMaxWidth = filename.length > 35 ? 300 : 500;
  return (
    <Grid container spacing={2} alignItems="center" wrap="nowrap">
      <Grid item>
        <Icon fontSize="small" style={{ textAlign: 'center' }}>
          <img
            src={iconSrc}
            style={{ display: 'flex', height: 'inherit', width: 'inherit' }}
          />
        </Icon>
      </Grid>
      {option.isLocal ? (
        <>
          <Grid item>
            <Typography variant="subtitle1" noWrap>
              {filename}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              noWrap
              style={{ maxWidth: dirnameMaxWidth }}
            >
              {dirname}
            </Typography>
          </Grid>
        </>
      ) : (
        <Grid item>
          <Typography variant="subtitle1" noWrap style={{ opacity: 0.7 }}>
            {option.path}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

const useStyles = makeStyles({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

const SelectModules: FC<Props> = ({ modules, label, value, onChange }) => {
  const classes = useStyles();
  const filterOptions = (
    options: Module[],
    { inputValue }: FilterOptionsState<Module>,
  ) =>
    matchSorter(options, inputValue, {
      keys: [({ path }) => path.replace(/\/_-\./g, ' ')],
    });
  const getOptionLabel = ({ path }: Module) => path;
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField {...params} label={label} variant="outlined" />
  );
  const handleChange = (_: ChangeEvent<{}>, value: Module[]) => {
    onChange?.(value);
  };
  const areModulesEqual = (option: Module, value: Module) =>
    option.path === value.path;

  return (
    <Autocomplete
      classes={classes}
      multiple
      options={modules}
      value={value}
      ListboxComponent={
        ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>
      }
      disableListWrap
      getOptionLabel={getOptionLabel}
      renderInput={renderInput}
      renderOption={renderOption}
      filterOptions={filterOptions}
      onChange={handleChange}
      getOptionSelected={areModulesEqual}
    />
  );
};

export default SelectModules;
