import { Spinner, Text, VStack } from '@chakra-ui/react'

const WaitScreen = () => {
    return (
        <VStack marginTop={"30px"}>
            <Text color={"pink.400"} as={"i"} fontWeight={"bold"}>
                Please wait. This may take up to a minute...
            </Text>
            <Spinner color='yellow.400'></Spinner>
        </VStack>
    );
}

export default WaitScreen;
