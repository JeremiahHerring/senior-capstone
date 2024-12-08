"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Collapse,
  Icon,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileRedirect = () => {
    router.push("/profile");
  };

  const handleProgressRedirect = () => {
    router.push("/progress");
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        {/* Mobile Menu Toggle */}
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        {/* Logo and Tabs */}
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align="center"
        >
          <Box
            as="img"
            src="../assets/logo.png"
            alt="Logo"
            onClick={() => (window.location.href = "/")}
            cursor="pointer"
            height="100px"
          />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        {/* User Buttons */}
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"md"}
                  icon={<Icon as={FaUser} boxSize="2em" />} // Fallback to a user icon
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
                <MenuItem onClick={handleProgressRedirect}>Progress</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                href={"/sign-in"}
              >
                Sign In
              </Button>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                href={"/sign-up"}
                _hover={{ bg: "pink.300" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => (
  <Box
    as="a"
    href={href}
    role={"group"}
    display={"block"}
    p={2}
    rounded={"md"}
    _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
  >
    <Stack direction={"row"} align={"center"}>
      <Box>
        <Text
          transition={"all .3s ease"}
          _groupHover={{ color: "pink.400" }}
          fontWeight={500}
        >
          {label}
        </Text>
        <Text fontSize={"sm"}>{subLabel}</Text>
      </Box>
    </Stack>
  </Box>
);

const MobileNav = () => (
  <Stack
    bg={useColorModeValue("white", "gray.800")}
    p={4}
    display={{ md: "none" }}
  >
    {NAV_ITEMS.map((navItem) => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
  </Stack>
);

const MobileNavItem = ({ label, children, href }) => {
  const { onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
      </Box>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Learning Modules",
    children: [
      { label: "Explore Data Structures", href: "/dashboard" },
      { label: "Explore Algorithms", href: "/dashboard" },
    ],
  },
  {
    label: "Inspiration",
    children: [
      {
        label: "Technical Interview Preparation",
        subLabel: "Break through the technical interview!",
        href: "https://www.techinterviewhandbook.org/software-engineering-interview-guide/",
      },
      {
        label: "Mastery of DSA",
        subLabel: "Master data structures and algorithms.",
        href: "/dashboard",
      },
    ],
  },
  { label: "About", href: "/" },
  { label: "Contact", href: "/" },
];

export default Navbar;
