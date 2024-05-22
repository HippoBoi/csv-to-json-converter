import { Spinner, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react';

const WaitScreen = () => {
    const [showMessage, setShowMessge] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowMessge(true);
        }, 6000) // 6 seg

        return () => clearTimeout(timeout);
    }, []);

    return (
        <VStack marginTop={"20px"}>
            <Text color={"pink.400"} as={"i"} fontWeight={"bold"}>
                Please wait. This may take up to a minute...
            </Text>
            <Spinner color='yellow.400'></Spinner>
            {showMessage && (
                <Text color={"pink.500"} as={"i"} fontWeight={"bold"}>
                    First time uploading a file will take longer because server is starting.
                </Text>
            )}
        </VStack>
    );
}

export default WaitScreen;
