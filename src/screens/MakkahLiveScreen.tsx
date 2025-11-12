import React, { useState } from 'react';
import '../App.css';

interface Channel {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'makkah-live-stream-1',
    title: '🕋 Makkah Live Stream 1',
    subtitle: 'Live streaming from the Holy Kaaba',
    youtubeId: '6F84NXOUCdw',
  },
  {
    id: 'makkah-live-stream-2',
    title: '🕋 Makkah Live Stream 2',
    subtitle: 'Live streaming from the Holy Kaaba',
    youtubeId: 'U6bEFxYWJlo',
  },
];

const MakkahLiveScreen: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(CHANNELS[0]);

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3F39 0%, #052F2A 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          Makkah Live
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Watch live streams from the Holy Kaaba
        </p>
      </div>

      {/* Channel Selector */}
      <div style={{
        padding: '20px',
        paddingBottom: '12px',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
      }}>
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel)}
            style={{
              minWidth: '200px',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: selectedChannel?.id === channel.id
                ? 'linear-gradient(135deg, #11C48D 0%, #00BFA5 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: selectedChannel?.id === channel.id ? '#FFFFFF' : '#BBE1D5',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
            }}
          >
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              marginBottom: '4px',
            }}>
              {channel.title}
            </p>
            <p style={{
              fontSize: '12px',
              margin: 0,
              opacity: 0.9,
            }}>
              {channel.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* Video Player */}
      {selectedChannel && (
        <div style={{ padding: '20px', paddingTop: '0' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedChannel.youtubeId}?autoplay=1&mute=0`}
              title={selectedChannel.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Channel Info */}
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#E7F5F1',
              marginBottom: '8px',
            }}>
              {selectedChannel.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#BBE1D5',
              marginBottom: '16px',
            }}>
              {selectedChannel.subtitle}
            </p>
            <p style={{
              fontSize: '12px',
              color: '#9E9E9E',
              lineHeight: '1.6',
            }}>
              Experience the spiritual atmosphere of Makkah with live streaming from the Holy Kaaba. 
              Watch pilgrims perform Tawaf and witness the beauty of the Masjid al-Haram in real-time.
            </p>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div style={{ padding: '20px', paddingTop: '0' }}>
        <div className="card" style={{ marginBottom: '12px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '8px',
          }}>
            About Makkah Live
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#BBE1D5',
            lineHeight: '1.6',
          }}>
            Watch live broadcasts from the Grand Mosque (Masjid al-Haram) in Makkah, Saudi Arabia. 
            Experience the spiritual atmosphere and witness pilgrims performing Tawaf around the Kaaba.
          </p>
        </div>

        <div className="card">
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#E7F5F1',
            marginBottom: '8px',
          }}>
            Tips for Watching
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            <li style={{
              fontSize: '14px',
              color: '#BBE1D5',
              marginBottom: '8px',
              lineHeight: '1.6',
            }}>
              • Streams are available 24/7 from the Holy Kaaba
            </li>
            <li style={{
              fontSize: '14px',
              color: '#BBE1D5',
              marginBottom: '8px',
              lineHeight: '1.6',
            }}>
              • Best viewed during prayer times for a more spiritual experience
            </li>
            <li style={{
              fontSize: '14px',
              color: '#BBE1D5',
              lineHeight: '1.6',
            }}>
              • Switch between different camera angles using the channel selector
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MakkahLiveScreen;

