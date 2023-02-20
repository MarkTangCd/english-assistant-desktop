import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Tag,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Spinner,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { initDB } from "../storage/index";
import Storage from "../storage/storage";
import { IWordsPanel, IArticle } from "../typings";
import { generateArticleOnWords } from "../api";

function GroupPage() {
  const [db, setDB] = useState<Storage | null>(null);
  const [group, setGroup] = useState<IWordsPanel>();
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const { id } = useParams<"id">();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  if (!id) {
    navigate('/');
    return <Box>Error</Box>;
  }

  const getGroup = async (id: number) => {
    if (db && id) {
      const group = await db.getGroupByID(id);
      if (!group) {
        navigate('/');
        return;
      }
      setGroup(group);
    }
  }

  const getArticle = async () => {
    if (group) {
      setLoading(true);
      const _article = await generateArticleOnWords(group.words);
      setArticle(_article);
      setLoading(false);
      onOpen();
    }
  }

  const saveArticle = async () => {
    if (db && article) {
      const result = await db.addArticle(Number.parseInt(id), article);
      if (result > 0) {
        toast({
          title: 'Note',
          description: "Saved success!",
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-left'
        });
        getArticles(Number.parseInt(id));
        onClose();
      }
    }
  }

  const getArticles = async (id: number) => {
    if (db) {
      const _articles = await db.getArticles(id);
      setArticles(_articles);
    }
  }

  const readArticle = (content: string) => {
    setLoading(false);
    onOpen();
    setArticle(content);
  }

  useEffect(() => {
    (async () => {
      setDB(await initDB());
    })();
  }, []);

  useEffect(() => {
    getGroup(Number.parseInt(id));
    getArticles(Number.parseInt(id));
  }, [db, id]);

  return (
    <Box>
      <Flex>
        <Box>
          <Heading>{group?.name}</Heading>
        </Box>
        <Box>
          {
            group?.words.map((item, index) => (
              <Tag style={{marginLeft: '5px', marginTop: '5px'}} key={index}>{ item }</Tag>
            ))
          }
        </Box>
      </Flex>
      <Flex>
        <Button colorScheme="blue" onClick={() => {onOpen();getArticle();}}>Generate Article</Button>
      </Flex>
      <Flex style={{ marginTop: '30px' }}>
        {
          articles.map((item, index) => (
            <Card key={index} onClick={() => readArticle(item.content)} style={{width: '230px', marginLeft: '15px', cursor: 'pointer'}}>
              <CardBody>
                <Text color="GrayText">
                  { item.content }
                </Text>
              </CardBody>
            </Card>
          ))
        }
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Article</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              loading ? (
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />
              )
              :
              (
                <Text color="GrayText">
                  { article }
                </Text>
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={getArticle}>
              Repeat
            </Button>
            <Button colorScheme="blue" variant='ghost' onClick={saveArticle}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default GroupPage;