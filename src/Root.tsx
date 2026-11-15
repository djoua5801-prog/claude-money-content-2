import React from "react";
import { Composition } from "remotion";
import { Explainer } from "./Explainer";
import { FPS, H, W } from "./theme";
import type { TimedVideo } from "./types";
// Wird von `npm run build:data` erzeugt (aus content/videos + ElevenLabs-Timings)
import videos from "./generated/videos.json";
// Kinetic Typography (aus tombrewsviews/BYOA, MIT) — story.json im Projektordner
import { KineticStory } from "./kinetic/KineticStory";
import { storySchema, storyDurationInFrames } from "./kinetic/schema";
import storyData from "../story.json";

const story = storySchema.parse(storyData);

export const RemotionRoot: React.FC = () => (
  <>
    {(videos as TimedVideo[]).map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={Explainer}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={Math.ceil((v.duration + 0.6) * FPS)}
        defaultProps={{ video: v }}
      />
    ))}
    <Composition
      id="KineticStory"
      component={KineticStory}
      schema={storySchema}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={story}
      calculateMetadata={({ props }) => ({ durationInFrames: storyDurationInFrames(props, 30) })}
    />
  </>
);
