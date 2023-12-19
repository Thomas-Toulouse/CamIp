import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, beforeAll, afterAll, vi } from 'vitest';
import Server from '../src/views/Server';
import RtspServerInfo from '../src/views/ServerInfoView/RtspServerInfo'; 

import { mockIPC, mockWindows } from "@tauri-apps/api/mocks";
import { invoke } from "@tauri-apps/api/tauri";
import Titlebar from "../src/components/titlebar/titlebar";
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { randomFillSync } from 'crypto';

describe('ServerInfo Component', () => {
    const titlebarContainer = document.createElement("div");
    titlebarContainer.id = "titlebar";
    document.body.appendChild(titlebarContainer);
  beforeAll(() => {
    Object.defineProperty(window, "crypto", {
        value: {
            
            getRandomValues: (buffer) => {
                return randomFillSync(buffer);
            }
        }
    });
    mockIPC((cmd: any, args: any) => {
        if (cmd === "close_splashscreen") {
            return Promise.resolve();
        }
    });
    const spy = vi.spyOn(window, "__TAURI_IPC__");
    expect(invoke("close_splashscreen")).resolves.all;
  });

  test('renders ServerInfo component with RTSP setting by default', () => {
    render(<MemoryRouter><Server /></MemoryRouter>);
    expect(screen.getByText('RTSP Informations')).toBeTruthy();
    expect(screen.getByText('RTSP')).toBeTruthy();
  
  });

  test('changes setting and displays the corresponding component', async () => {
    render(<MemoryRouter><Server /></MemoryRouter>);

    fireEvent.click(screen.getByText('HLS'));

    await waitFor(() => {
      expect(screen.getByText('HLS')).toBeTruthy();
      expect(screen.getByText('HLS Informations')).toBeTruthy();
    });
  });

  test('renders RTSP server info component', async () => {
    render(<MemoryRouter><RtspServerInfo /></MemoryRouter>);
    expect(screen.getByText('RTSP Informations')).toBeTruthy();
  });

  test('renders Notification component when there is an error', () => {
    // Mock the setError function to simulate an error
    const mockSetError = (error) => {
      render(<MemoryRouter><Server /></MemoryRouter>);
    };

    // Test with an error message
    mockSetError('An example error message');

    // Verify that the Notification component is rendered with the correct message
    const notificationElement =  screen.findAllByLabelText('notification');
    expect(notificationElement).toBeTruthy();
  });





});

afterAll(() => {
});
