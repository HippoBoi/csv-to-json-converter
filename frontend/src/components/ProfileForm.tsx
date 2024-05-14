import { Button, Input, VStack, Text } from '@chakra-ui/react'
import { FormEvent } from 'react'

interface Props {
    appStatus: string;
    onInputChange: (event: EventTarget & HTMLInputElement) => void;
    onSubmit: (event: FormEvent) => void;
}

const ProfileForm = ({ appStatus, onSubmit, onInputChange }: Props) => {
    return (
        <form onSubmit={(event) => onSubmit(event)}>
            <VStack>
                <Text 
                    fontWeight={"bold"} 
                    align={"center"}
                    color={"yellow.600"}>
                    Select a CSV file to convert.
                </Text>
                <input 
                    disabled={appStatus === "uploading"}
                    onChange={(event) => onInputChange(event.target)}
                    type='file' 
                    accept='.csv' />

                <Button
                    type='submit'
                    colorScheme={appStatus === "ready_upload" ? 'yellow' : "gray"}
                    _hover={appStatus === "ready_upload" ? {
                        transform: "scale(1.1)",
                        transition: "transform 0.2s ease"
                    } : {
                        transform: "scale(1)"
                    }}>
                    Upload File
                </Button>

                <Text fontWeight={"bold"} fontSize={"12px"} color={"red.400"}>
                    File must weight less than 1 MB
                </Text>
            </VStack>
        </form>
    )
}

export default ProfileForm
