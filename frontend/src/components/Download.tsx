import { Button, Text, VStack } from '@chakra-ui/react'
import { APP_STATUS } from '../App';
import { useEffect, useState } from 'react';
import { getFileUrl } from '../services/api-client';
import { toast } from 'sonner';

interface Props {
    appStatus: string;
}

const Download = ({ appStatus }: Props) => {
    const [textError, setTextError] = useState("");

    const handleDownload = async () => {
        if (appStatus !== APP_STATUS.READY_USAGE) {
            return;
        }

        const [error, url] = await getFileUrl();
        if (error) {
            toast.error(error.message);
        }

        if (!url) {
            return;
        }

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'converted.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success("File is downloading...")
    };

    useEffect(() => {
        setTextError("");
    }, [appStatus])

    return (
        <VStack marginTop={"80px"}>
            <Text fontWeight={"bold"} color={appStatus === APP_STATUS.READY_USAGE ? 'pink.600' : "gray.400"}>
                Download converted file
            </Text>

            <Button
                onClick={() => {
                    appStatus === APP_STATUS.READY_USAGE 
                    ? handleDownload()
                    : setTextError("No file to download.");
                }}
                borderRadius={2}
                colorScheme={appStatus === APP_STATUS.READY_USAGE ? "purple" : "gray"}
                _hover={appStatus === APP_STATUS.READY_USAGE ? {
                    transform: "scale(1.15)",
                    transition: "transform 0.2s ease"
                } : {
                    transition: "transform 0.2s ease"
                }}>
                Download
            </Button>
            {textError && <Text fontWeight={"italic"} color={'pink.600'}>
                {textError}
            </Text>}
        </VStack>
    );
}

export default Download
