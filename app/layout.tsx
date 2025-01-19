"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create Apollo Client
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("token"); // Fetch token from cookies
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ networkError }) => {
  // if (graphQLErrors) {
  //   graphQLErrors.forEach(({ message, locations, path }) =>
  //     // console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
  //   );
  // }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        ><ApolloProvider client={client}>
          {children}</ApolloProvider>
        </body>
      
    </html>
  );
}
