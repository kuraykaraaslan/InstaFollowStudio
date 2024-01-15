'use client';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import getElementByXpath from '../helpers';

// Components
import Content from './Content';


const isActivated = async () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get('enabled', (data) => {
            resolve(data.enabled || false);
        });
    });
}

const isInstagram = async () => {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url || '';
            resolve(url.includes('instagram.com'));
        });
    }
    );
}

function setEnabled(): Promise<void> {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set({ enabled: true }, () => {
            resolve();
        });
        window.close();
    });
}

function setDisabled(): Promise<void> {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set({ enabled: false }, () => {
            resolve();
        });
        window.close();
    });
}

async function ContentRoot() {

    const pageUrl = window.location.href;

    // Variables
    const url = window.location.href;
    const body = getElementByXpath('/html/body');

    // If root element already exists, return
    if (document.getElementById('insta-follow-studio-root')) {
        return;
    }

    // If body is null, return
    if (!body) {
        return;
    }


    // Initialize the root element
    const rootElement = document.createElement('div');
    rootElement.id = 'insta-follow-studio-root';

    // Add content to root element
    if (pageUrl.includes('instagram.com') && await isActivated()) {


        if (!(body instanceof HTMLElement) || body.style === undefined) {
            return;
        } 

        //disable body scroll
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';

        createRoot(rootElement).render(
                <Content />
            ,
        );

        body.insertBefore(rootElement, body.firstChild);

    }



    // Add first child to body

    const selfProfileUrl = getElementByXpath('/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div/div[6]/div/span/div/a');
}

ContentRoot();
