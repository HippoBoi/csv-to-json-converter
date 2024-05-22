import { FormEvent, useState } from 'react'
import { Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import ProfileForm from './components/ProfileForm';
import { Data, uploadFile } from './services/api-client';
import { Toaster, toast } from 'sonner';
import Search from './components/Search';
import CSVList from './components/CSVList';
import WaitScreen from './components/WaitScreen';
import Download from './components/Download';

export const APP_STATUS = {
    IDLE: "idle",
    READY_UPLOAD: "ready_upload",
    UPLOADING: "uploading",
    READY_USAGE: "ready_usage"
} as const;

type appStatusType = typeof APP_STATUS[keyof typeof APP_STATUS];

function App() {
    const [appStatus, setAppStatus] = useState<appStatusType>(APP_STATUS.IDLE);
    const [data, setData] = useState<Data>([]);
    const [csvData, setCsvData] = useState<Data>([]);
    const [file, setFile] = useState<File | null>(null);

    const handleInputChange = (event: EventTarget & HTMLInputElement) => {
        const [file] = event.files ?? [];
        if (file) {
            setFile(file);
            setAppStatus(APP_STATUS.READY_UPLOAD);
            console.log(file);
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const maxSize = 1000000; // 1 MB

        if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
            return;
        }
        if (file.size > maxSize) {
            setAppStatus(APP_STATUS.READY_UPLOAD);
            toast.error("File size is bigger than 1 MB")
            return;
        }
        console.log("uplodig nooww", appStatus);
        setAppStatus("uploading");

        const [error, newData] = await uploadFile(file);

        if (error) {
            setAppStatus(APP_STATUS.READY_UPLOAD);
            toast.error(error.message);
            return;
        }

        if (newData) setData(newData);
        setAppStatus(APP_STATUS.READY_USAGE);
        toast.success("File uploaded succesfully.");
    }

    return (
        <Grid templateAreas={`"top top top"
                            "left main right"`}>
            <GridItem area={"top"}>
                <Text
                    align={"center"}
                    bgGradient={"radial(#7928CA, #FF0080)"}
                    bgClip="text"
                    fontSize="6xl"
                    fontWeight="extrabold"
                    whiteSpace={"nowrap"}>
                    CSV to JSON converter
                </Text>
                <Toaster duration={3000}/>
            </GridItem>

            <GridItem area={"main"} marginTop={"50px"} marginBottom={"50px"}>
                <ProfileForm 
                    appStatus={appStatus} 
                    onInputChange={handleInputChange}
                    onSubmit={(event) => {
                        handleSubmit(event);
                    }} />

                {appStatus === APP_STATUS.UPLOADING && (
                    <WaitScreen />
                )}
                
                <Download appStatus={appStatus} />

                {appStatus === APP_STATUS.READY_USAGE && (
                    <VStack marginTop={"70px"}>
                        <Search initialData={data} onSearchChange={(newData) => setCsvData(newData)} />
                        <CSVList csvData={csvData} />
                    </VStack>
                )}
            </GridItem>
        </Grid>
    );
}

export default App
