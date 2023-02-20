import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flex,
  Box,
  Button,
  Input,
  Textarea,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { initDB } from "../storage";
import Storage from "../storage/storage";
import WordsPanel from "../components/WordsPanel";
import { IWordsPanel } from "../typings";

function IndexPage() {
  const [groupName, setGroupName] = useState('');
  const [originGroup, setOriginGroup] = useState('');
  const [panels, setPanels] = useState<IWordsPanel[]>([]);
  const [db, setDB] = useState<Storage | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const getGroups = async () => {
    if (db) {
      const list = await db.getGroups();
      setPanels(list);
    }
  }

  const addGroup = async () => {
    if (groupName && originGroup && db) {
      const _words = originGroup.split(',');
      if (_words.length > 20) {
        toast({
          title: 'Note',
          description: "Only 20 words can be stored in a group!",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-left'
        });
        return;
      }

      const result = await db.addGroup({
        name: groupName,
        words: originGroup.split(',')
      });

      if (result > 0) {
        setGroupName('');
        setOriginGroup('');

        toast({
          title: 'Note',
          description: "Created success!",
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-left'
        });
        getGroups();
        onClose();
      }
    }
  }

  useEffect(() => {
    (async () => {
      setDB(await initDB());
    })();
  }, []);

  useEffect(() => {
    getGroups();
  }, [db]);

  return (
    <Box>
      <Box style={{marginTop: '50px', padding: '25px'}}>
        <Flex>
          <Box w="135px">
            <Button colorScheme='purple' onClick={onOpen}>Create Group</Button>
          </Box>
        </Flex>
      </Box>
      <Flex style={{marginTop: '20px', padding: '10px'}}>
        {
          panels.map((item, index) => (
            <Link key={index} to={`/group/${item.id}`}>
              <WordsPanel name={item.name} words={item.words} />
            </Link>
          ))
        }
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Words Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%">
              <Box>
                <Input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              </Box>
              <Box style={{marginTop: '20px'}}>
                <Textarea size='sm' placeholder='Please enter that you would like join English words of this group and words and Words are separated by ,' value={originGroup} onChange={(e) => setOriginGroup(e.target.value)} />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button isDisabled={!groupName || !originGroup} variant='ghost' onClick={addGroup}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default IndexPage;
