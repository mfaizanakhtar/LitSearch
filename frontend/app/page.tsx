"use client";

import React, { useState } from "react";
import Mock from "./components/mock";
import Card from "./components/card";
import Paper from './interfaces';
import Search from "./components/search";
import getState from "./state";

export default function Home() {
  const papers = getState((state) => state.papers);
  
  return <>
    <main className="w-1/3 h-full flex flex-col">
      <Search />
      <ul role="list" className="mt-6 space-y-3 mt-6 px-4 sm:px-6 lg:px-8">
        {papers.map((paper) => (
          <Card {... paper} />
        ))}
      </ul>
      <Mock />
    </main>

    <aside className="fixed inset-y-0 right-0 w-2/3 flex flex-col">
      <Mock />
    </aside>
  </>
}
