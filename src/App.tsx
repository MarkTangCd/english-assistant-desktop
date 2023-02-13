import {
  Flex,
  Center,
  Heading,
} from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/index";
import GroupPage from "./pages/group";
import "./App.css";

function App() {

  return (
    <Flex direction="column" h="100vh">
      <Center>
        <Heading>English Assistant</Heading>
      </Center>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/group/:id" element={<GroupPage />} />
      </Routes>
    </Flex>
  );
}

export default App;
