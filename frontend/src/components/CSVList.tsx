import React from 'react'
import { Data } from '../services/api-client'
import { Card, CardBody, List, ListItem, Text, VStack } from '@chakra-ui/react';

interface Props {
    csvData: Data;
}

const CSVList = ({ csvData }: Props) => {
    return (
        <Card>
        <List>
            <VStack>
                <CardBody>
                {csvData.map((data, index) => (
                    <ListItem marginBottom={"20px"} key={data.id ? data.id : index}>
                        {Object.entries(data).map(([key, value]) => (
                            <Text marginTop={"5px"} key={value}>{key + ": " + value}</Text>
                        ))}
                    </ListItem>
                ))}
                </CardBody>
            </VStack>
        </List>
        </Card>
    );
}

export default CSVList
