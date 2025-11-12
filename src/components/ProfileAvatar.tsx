import React, { useRef } from 'react';
import { colors } from '../utils/theme';

interface ProfileAvatarProps {
  profilePicture?: string;
  name?: string;
  size?: number;
  showBorder?: boolean;
  editable?: boolean;
  onImageChange?: (imageUri: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profilePicture,
  name,
  size = 80,
  showBorder = false,
  editable = false,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageChange(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarContent = profilePicture ? (
    <img
      src={profilePicture}
      alt={name || 'Profile'}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
      }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.accentTeal} 0%, ${colors.accentGreen} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
      }}
    >
      {name ? name.charAt(0).toUpperCase() : '👤'}
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={editable ? handleImageClick : undefined}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: editable ? 'pointer' : 'default',
          border: showBorder ? `2px solid rgba(255, 255, 255, 0.3)` : 'none',
          position: 'relative',
        }}
      >
        {avatarContent}
        {editable && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              top: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          >
            <span style={{ fontSize: `${size * 0.3}px`, color: '#FFFFFF' }}>📷</span>
          </div>
        )}
      </div>
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;

