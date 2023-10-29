import { defineConfig, presets } from 'sponsorkit'

const MODE = process.env.ORGANIZATION_SPONSORS ? 'organization' : 'personal'

const sponsorsSorter = (_, tierSponsors) => {
  tierSponsors.sort((a, b) =>
    a.sponsor.login
      .toLocaleLowerCase()
      .localeCompare(b.sponsor.login.toLocaleLowerCase())
  )
}

export default defineConfig({
  // Providers configs
  github: {
    login: 'yhatt',

    // Required Classic PAT with permission both of `read:user` and `read:org`
    token: process.env.GITHUB_PAT,
  },

  // Rendering configs
  width: 830,
  formats: ['json', 'svg'],
  tiers: [
    {
      preset: presets.none,
    },
    {
      // title: 'Mid-tier Sponsors',
      monthlyDollars: 5,
      preset: { ...presets.medium, name: undefined },
      composeBefore: sponsorsSorter,
    },
    {
      // title: 'Top-tier Sponsors',
      monthlyDollars: 10,
      preset: presets.xl,
      composeBefore: sponsorsSorter,
    },
  ],
  svgInlineCSS: `
text {
  font: bold 16px Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;
  fill: #888;
}
a {
  cursor: pointer;
}
`.trim(),

  // Personal or organization
  name: MODE,
  cacheFile: `cache/${MODE}.json`,
  filter: ({ sponsor, isOneTime }) => {
    if (isOneTime) return false
    if (MODE === 'organization') {
      return sponsor.type === 'Organization'
    } else {
      return sponsor.type === 'User'
    }
  },
})
