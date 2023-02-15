import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Popover,
  Stack,
  TextField,
  ToggleButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChampTable from "./components/ChampTable";
import Layout from "./components/Layout";
import jsonData from "./data/characters.json";
import type { Character, SelectedFilters, StatsAvg } from "./types";
import { Dispatch } from "react";

const data: Character[] = jsonData as Character[];

const AppContainer = styled.div`
  background-color: #F5FDFF;
`
const SelectedChampsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;

function App() {
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [filteredChamps, setFilteredChamps] = useState<Character[]>([]);
  const [selectedChamps, setSelectedChamps] = useState<Character[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    name: "",
    my_team: false,
    tag: [],
  });
  const [statsAvg, setStatsAvg] = useState<StatsAvg>({
    power: 0,
    mobility: 0,
    technique: 0,
    survivability: 0,
    energy: 0,
  });
  // Handle dataFetch
  useEffect(() => {
    // Fetch character list
    const getCharactersList = () => {
      setCharacterList(data);
      setFilteredChamps(data);
    };
    getCharactersList();
    // Set filters
    let FilterArray: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const champ = data[i];
      data[i].tags?.map((tag) => {
        if (!FilterArray.includes(tag.tag_name)) {
          FilterArray.push(tag.tag_name);
        }
      });
    }
    setFilters(FilterArray.sort((a,b)=> a.localeCompare(b)));
    return () => {};
  }, []);
  // Handle AverageStats of SelectedChamps
  useEffect(() => {
    let avgStats = {
      power: 0,
      mobility: 0,
      technique: 0,
      survivability: 0,
      energy: 0,
    };

    if (selectedChamps.length > 0) {
      let powerSum = 0;
      let mobilitySum = 0;
      let techiqueSum = 0;
      let survivabilitySum = 0;
      let energySum = 0;
      selectedChamps.map((champ) => {
        powerSum += champ.abilities[2].abilityScore;
        mobilitySum += champ.abilities[1].abilityScore;
        techiqueSum += champ.abilities[3].abilityScore;
        survivabilitySum += champ.abilities[0].abilityScore;
        energySum += champ.abilities[4].abilityScore;
      });
      avgStats = {
        power: Math.round((powerSum / selectedChamps.length) * 100) / 100,
        mobility: Math.round((mobilitySum / selectedChamps.length) * 100) / 100,
        technique:
          Math.round((techiqueSum / selectedChamps.length) * 100) / 100,
        survivability:
          Math.round((survivabilitySum / selectedChamps.length) * 100) / 100,
        energy: Math.round((energySum / selectedChamps.length) * 100) / 100,
      };
      setStatsAvg(avgStats);
    } else {
      setStatsAvg(avgStats);
    }

    return () => {};
  }, [selectedChamps]);

  // Handle SelectedFilters
  useEffect(() => {
    const checkTagName = (champ: Character) => {
      if (!champ.tags) return false;
      for (let i = 0; i < champ.tags.length; i++) {
        const tag = champ.tags[i];
        if (tag.tag_name.toLowerCase().includes(selectedFilters["name"])) {
          return true;
        }
      }
      return false;
    };
    const handleFilterName = (champ: Character) => {
      if (
        champ.name.toLowerCase().includes(selectedFilters["name"]) ||
        checkTagName(champ) ||
        selectedFilters["name"] == ""
      ) {
        return true;
      } else {
        return false;
      }
    };
    const handleFilterTag = (champ: Character) => {
      if (selectedFilters["tag"].length == 0) return true;
      if (!champ.tags) return false;
      for (let i = 0; i < champ.tags.length; i++) {
        const tag = champ.tags[i];
        if (selectedFilters["tag"].includes(tag.tag_name)) {
          return true;
        }
      }
      return false;
    };
    const handleFilterMyTeam = (champ: Character) => {
      if (!selectedFilters["my_team"]) {
        return true;
      } else {
        if (selectedChamps.includes(champ)) {
          return true;
        }
      }

      return false;
    };

    const handleFilters = () => {
      const filteredData = characterList.filter((champ) => {
        if (
          handleFilterName(champ) 
          &&
          handleFilterTag(champ) &&
          handleFilterMyTeam(champ)
        ) {
          return true;
        }
      });
      setFilteredChamps(filteredData);
    };

    if (characterList.length > 0) handleFilters();

    return () => {};
  }, [selectedFilters]);

  // Handle Input for SearchCharacter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input_value = e.target.value;
    setSelectedFilters({ ...selectedFilters, name: input_value });
  };

  if (characterList.length === 0 || filters.length === 0)
    return <div>Loading</div>;

  return (
    <AppContainer>
      <Layout>
        <div
          style={{
            width: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* SelectedChamps Container */}
          <SelectedChamps
            selectedChamps={selectedChamps}
            setSelectedChamps={setSelectedChamps}
          />

          {/* Average Stats */}
          <AverageStats statsAvg={statsAvg} />

          {/* Filters Container */}
          <div style={{ display: "flex", columnGap: "10px" }}>
            {/* Input Search Characters */}
            <TextField
              style={{ width: "50%" }}
              id="outlined-basic"
              label="Search Characters..."
              variant="outlined"
              onChange={handleInputChange}
            />
            {/* Filters */}
            <FilterList
              filters={filters}
              selectedChamps={selectedChamps}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
            {/* My team button */}
            <ToggleButton
              color='primary'
              style={{ width: "25%" }}
              value={selectedFilters['my_team']}
              selected={selectedFilters['my_team']}
              disabled={selectedChamps.length==0}
              onChange={()=> setSelectedFilters({...selectedFilters,my_team: !selectedFilters['my_team']})}
              aria-label="left aligned"
            >
              my-team
            </ToggleButton>

          </div>
          {/* List SelectedFilters */}
        <ListSelectedFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
        </div>
        
          {/* Champ table */}
        <ChampTable
          filteredChamps={filteredChamps}
          selectedChamps={selectedChamps}
          setSelectedChamps={setSelectedChamps}
        />
      </Layout>
    </AppContainer>
  );
}

const SelectedChamps: React.FC<{selectedChamps: Character[]; setSelectedChamps: Dispatch<Character[]>;
}> = ({ selectedChamps, setSelectedChamps }) => {
  return (
    <div style={{ height: "140px" }}>
      {selectedChamps.length == 0 ? (
        <h1>Select your squad to defend earthrealm</h1>
      ) : (
        <div>
          <h1>Your Champions</h1>
          <SelectedChampsContainer>
            {selectedChamps.map((champ) => (
              <IconButton
                key={champ.id}
                onClick={() =>
                  setSelectedChamps(
                    selectedChamps.filter((mychamp) => mychamp.id !== champ.id)
                  )
                }
              >
                <Avatar
                  alt="Champ Logo"
                  src={champ.thumbnail}
                  sx={{ width: 80, height: 80 }}
                />
              </IconButton>
            ))}
          </SelectedChampsContainer>
        </div>
      )}
    </div>
  );
};

const AverageStats: React.FC<{ statsAvg: StatsAvg }> = ({ statsAvg }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        textAlign: "center",
        margin: "40px 0",
      }}
    >
      <div>
        <h4>Power</h4>
        <h2>{statsAvg["power"]}</h2>
      </div>
      <div>
        <h4>Mobility</h4>
        <h2>{statsAvg["mobility"]}</h2>
      </div>
      <div>
        <h4>Technique</h4>
        <h2>{statsAvg["technique"]}</h2>
      </div>
      <div>
        <h4>Survivability</h4>
        <h2>{statsAvg["survivability"]}</h2>
      </div>
      <div>
        <h4>Energy</h4>
        <h2>{statsAvg["energy"]}</h2>
      </div>
    </div>
  );
};

const FilterList: React.FC<{  filters: string[];  selectedChamps: Character[];  selectedFilters: SelectedFilters;  setSelectedFilters: Dispatch<SelectedFilters>;
}> = ({ filters, selectedChamps, selectedFilters, setSelectedFilters }) => {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClickChip = (chipData: string) => () =>{
    if(selectedFilters["tag"].includes(chipData)){
      setSelectedFilters({
        ...selectedFilters,
        tag: selectedFilters.tag.filter(tag => tag !== chipData),
      })
    }else{
      setSelectedFilters({
        ...selectedFilters,
        tag: [...selectedFilters.tag,chipData],
      })
    }
    


  };
  return (
    <div style={{ width: "25%" }}>
      <Button sx={{width: "100%", height: "100%"}} aria-describedby={id} variant='outlined' onClick={handleClick} color='primary'>
        Tags
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{display: "block"}}
      >
    <Stack direction={"row"} display="flex" flexWrap={"wrap"} width="350px">
    {filters.map(filter => <Chip variant={selectedFilters['tag'].includes(filter) ? "filled" : 'outlined'} color='primary' key={filter} label={filter} sx={{margin: "5px"}} onClick={handleClickChip(filter)}/>)}
    </Stack>
      </Popover>
    </div>
  );
};

const ListSelectedFilters: React.FC<{selectedFilters: SelectedFilters, setSelectedFilters: Dispatch<SelectedFilters>}> = ({selectedFilters, setSelectedFilters}) => {
  
  const handleChipDelete = (chipData: string) => {
    setSelectedFilters({
      ...selectedFilters,
      tag: selectedFilters.tag.filter(tag => tag !== chipData),
    })
  }

  return(
    <div style={{display: "flex", margin: '10px 0', columnGap: "10px"}}>
      {selectedFilters['tag'].map(tag => 
        <Chip key={tag} color="primary" variant='filled' label={tag} onDelete={() => {handleChipDelete(tag)}}/>
        )}
    </div>
  )
}

export default App;
