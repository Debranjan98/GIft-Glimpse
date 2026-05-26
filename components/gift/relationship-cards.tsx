"use client";

import { RelationshipType, relationshipProfiles } from "@/lib/gift/schema";

type Props = {
  value: RelationshipType;
  onChange: (value: RelationshipType) => void;
};

export default function RelationshipCards({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {relationshipProfiles.map((profile) => {
        const selected = value === profile.id;

        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => onChange(profile.id)}
            className={`group relative overflow-hidden rounded-[1.35rem] border p-4 text-left transition duration-300 ${
              selected
                ? "border-white bg-white shadow-2xl"
                : "border-white/70 bg-white/55 hover:-translate-y-1 hover:bg-white/85"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${profile.gradient}`}
            />
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
              style={{ backgroundColor: profile.accent }}
            >
              {profile.label.slice(0, 1)}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">
                  {profile.label}
                </h3>
                <p className="mt-1 text-sm font-medium text-stone-500">
                  {profile.shortLabel}
                </p>
              </div>
              {selected && (
                <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
                  Chosen
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {profile.cardCopy}
            </p>
          </button>
        );
      })}
    </div>
  );
}
