import { Input, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Data, searchData } from '../services/api-client'
import { toast } from 'sonner';

interface Props {
    initialData: Data;
    onSearchChange: (newData: Data) => void;
}

const Search = ({ initialData, onSearchChange }: Props) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetch = async () => {
            const [error, newData] = await searchData(search);
            if (error) {
                toast.error(error.message);
            }

            if (newData && typeof newData !== undefined) onSearchChange(newData);
        };

        if (search === "") {
            onSearchChange(initialData);
            return;
        }

        fetch();
    }, [search])

    return (
        <VStack>
            <Text as={"i"}>Filter Data</Text>
            <Input 
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Search data...'
                type='search' />
        </VStack>
    )
}

export default Search;