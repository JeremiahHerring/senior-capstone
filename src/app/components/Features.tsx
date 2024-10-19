'use client'

import { ReactNode } from 'react'
import { Stack, Container, Box, Flex, Text, Heading, SimpleGrid } from '@chakra-ui/react'

export default function Features() {
  return (
    <Box bg={'gray.800'} position={'relative'}>
      <Flex
        flex={1}
        zIndex={0}
        display={{ base: 'none', lg: 'flex' }}
        backgroundImage="url('/templates/stats-grid-with-image.png')"
        backgroundSize={'cover'}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        position={'absolute'}
        width={'50%'}
        insetY={0}
        right={0}>
        <Flex
          bgGradient={'linear(to-r, gray.800 10%, transparent)'}
          w={'full'}
          h={'full'}
        />
      </Flex>
      <Container maxW={'7xl'} zIndex={10} position={'relative'}>
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <Stack
            flex={1}
            color={'gray.400'}
            justify={{ lg: 'center' }}
            py={{ base: 4, md: 25, xl: 60 }}>
            <Box mb={{ base: 8, md: 20 }}>
              <Heading color={'white'} mb={5} fontSize={{ base: '3xl', md: '5xl' }}>
                Personalized Learning Platform
              </Heading>
              <Text fontSize={'xl'} color={'gray.400'}>
                The learning platform allows you to prepare for online assessments and technical interviews by giving you a personalized roadmap tailored to your skill level and topics that you want more practice on.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {stats.map((stat) => (
                <Box key={stat.title}>
                  <Text fontFamily={'heading'} fontSize={'3xl'} color={'white'} mb={3}>
                    {stat.title}
                  </Text>
                  <Text fontSize={'xl'} color={'gray.400'}>
                    {stat.content}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
          <Flex flex={1} />
        </Stack>
      </Container>
    </Box>
  )
}

const StatsText = ({ children }: { children: ReactNode }) => (
  <Text as={'span'} fontWeight={700} color={'white'}>
    {children}
  </Text>
)

const stats = [
  {
    title: '20+',
    content: (
      <>
        <StatsText>Learning Modules</StatsText> for each data structures and algorithm
      </>
    ),
  },
  {
    title: '100+',
    content: (
      <>
        <StatsText>Practice Problems</StatsText> that will help you master DSA
      </>
    ),
  },
  {
    title: '10+',
    content: (
      <>
        <StatsText>Leaning Metrics</StatsText> where you can see how you're improving
      </>
    ),
  },
  {
    title: '20+',
    content: (
      <>
        <StatsText>Graphs and Models</StatsText> visualizing how algorithms work
      </>
    ),
  },
]