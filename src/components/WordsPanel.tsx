import { FC } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Box,
  Tag,
  Heading
} from "@chakra-ui/react";
import { IWordsPanel } from '../typings';

const WordsPanel: FC<IWordsPanel> = ({ name, words }) => {
  return (
    <Card style={{width: '230px', marginLeft: '15px', cursor: 'pointer'}}>
      <CardHeader>
        <Heading size="md">{ name }</Heading>
      </CardHeader>
      <CardBody>
         <Box>
           {words.map((item, index) => (
              <Tag style={{marginLeft: '5px', marginTop: '5px'}} key={index}>{item}</Tag>
            ))}
         </Box> 
      </CardBody>
    </Card>
  );
}

export default WordsPanel;