import * as React from 'react';
import { Card, CardHeader, CardFooter, CardPreview, Text, Avatar, Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    width: '320px',
    margin: tokens.spacingHorizontalM,
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusMedium,
    background: tokens.colorNeutralBackground1,
  },
  preview: {
    height: '120px',
    background: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderTopRightRadius: tokens.borderRadiusMedium,
  },
  duration: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    borderRadius: tokens.borderRadiusSmall,
    padding: '2px 8px',
    fontSize: '12pt',
    fontWeight: 600,
  },
});

export interface CourseCardProps {
  title: string;
  description?: string;
  duration?: string;
  type?: string;
  iconUrl?: string;
  author?: string;
  views?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, description, duration, type, iconUrl, author, views }) => {
  const styles = useStyles();
  return (
    <Card className={styles.root}>
      <CardPreview className={styles.preview}>
        <img src={iconUrl || 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'} alt="Course Icon" style={{ width: 64, height: 64, borderRadius: '50%' }} />
        {duration && <span className={styles.duration}>{duration}</span>}
      </CardPreview>
      <CardHeader
        header={<Text weight="semibold">{title}</Text>}
        description={<Text size={300}>{description}</Text>}
      />
      <CardFooter>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={author || 'Learningpath'} size={24} />
          <Text size={200}>{type || 'Learningpath'}</Text>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size={200}>{views ?? 0}</Text>
          <Button appearance="subtle" icon={<span>☆</span>} />
          <Button appearance="subtle" icon={<span>⋯</span>} />
        </div>
      </CardFooter>
    </Card>
  );
};