import { Character } from "../types";
import styled from "@emotion/styled";
import { Avatar, Checkbox, Chip } from "@mui/material";
import { Dispatch } from "react";

const ChampContainer = styled.div`
  text-align: center;
`;

const Table = styled.table`
    width: 90%;
    margin: auto;
    margin-bottom: 60px;

    tbody{
      background-color: white;
      margin-top: 10px;
    }

    .tr_data{
      &:hover{
        cursor: pointer;
      }
    }
`

const ChampTable: React.FC<{ filteredChamps: Character[],selectedChamps: Character[], setSelectedChamps: Dispatch<Character[]>}> = ({
  filteredChamps,
  selectedChamps,
  setSelectedChamps
}) => {

  // Handle selected champ
  const handleSelectedChamps = (champ: Character) => {
    const isSelected = selectedChamps.filter(mychamp => mychamp.id == champ.id)
    if(isSelected.length == 0){
      setSelectedChamps([...selectedChamps,champ])
    }else{
      setSelectedChamps(selectedChamps.filter(mychamp => mychamp.id !== champ.id))
    }

  }
  return (
    <ChampContainer>
      <p style={{textAlign: "left", margin:"60px 60px 10px 60px"}}>Results: {filteredChamps.length}</p>
      <Table>
        <thead><tr>
          <th>Character</th>
          <th>Tags</th>
          <th>Power</th>
          <th>Movility</th>
          <th>Technique</th>
          <th>Survivability</th>
          <th>Energy</th>
        </tr></thead>
        
        <tbody>
        {filteredChamps.slice(0,10).map((champ) => (
          <tr className="tr_data" key={champ.id} onClick={() => handleSelectedChamps(champ)}>
            {/* Name */}
            <td>
              <div style={{ display: "flex", alignItems: "center", columnGap:"30px" }}>
                <Checkbox checked={selectedChamps.some(mychamp => mychamp.id == champ.id)} id={champ.id.toString()}/>
                <Avatar alt="champ logo" src={champ.thumbnail}/>
                <p>{champ.name}</p>
              </div>
            </td>
            {/* Tags */}
            <td>
              <div>
                {champ.tags?.map((tag,i) => (
                  <Chip color="primary" label={tag.tag_name} variant="outlined" key={i} sx={{margin: "0 5px"}}/>
                ))}
              </div>
            </td>
            {/* Power */}
            <td>
              <div style={champ.abilities[2].abilityScore == 10 ? {color: "red"} : {color:"black"}}>{champ.abilities[2].abilityScore}</div>
            </td>
            {/* Movility */}
            <td>
                <div style={champ.abilities[1].abilityScore == 10 ? {color: "red"} : {color:"black"}}>{champ.abilities[1].abilityScore}</div>
            </td>
            {/* Technique */}
            <td>
            <div style={champ.abilities[3].abilityScore == 10 ? {color: "red"} : {color:"black"}}>{champ.abilities[3].abilityScore}</div>
            </td>
            {/* Survivability */}
            <td>
            <div style={champ.abilities[0].abilityScore == 10 ? {color: "red"} : {color:"black"}}>{champ.abilities[0].abilityScore}</div>
            </td>
            {/* Energy */}
            <td>
            <div style={champ.abilities[4].abilityScore == 10 ? {color: "red"} : {color:"black"}}>{champ.abilities[4].abilityScore}</div>
            </td>
          </tr>
        ))}
        </tbody>
        
      </Table>
    </ChampContainer>
  );
};

export default ChampTable;
