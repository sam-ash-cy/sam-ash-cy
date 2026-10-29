// Shape of profile.config.ts. Kept separate so the config file stays easy to read.

export type Theme = {
	accent: string;
	accentBright: string;
	background: string;
	surface: string;
	border: string;
	text: string;
	body: string;
	muted: string;
	dim: string;
	warning: string;
};

export type Icon = {
	// Local filename in assets/imgs/icons/ (without .svg).
	id: string;
	// Display name, used for alt text and the hover tooltip.
	name: string;
	// Filename in tandpfun/skill-icons (without .svg), e.g. "PHP-Dark".
	skillIcon: string;
};

export type Pill = {
	id: string;
	name: string;
	// Simple Icons slug (https://simpleicons.org). Leave out for a text-only pill.
	logo?: string;
	logoColor?: string;
};

export type StackGroup = {
	title: string;
	icons?: Icon[];
	pills?: Pill[];
};

export type Cert = {
	id: string;
	// Full name, used for alt text.
	name: string;
	// Text shown on the badge.
	badgeText: string;
	year?: number;
	inProgress?: boolean;
	logo?: string;
};

export type Project = {
	id: string;
	name: string;
	description: string;
	tech: string[];
	url?: string;
	inProgress?: boolean;
};

export type AboutParagraph = {
	label?: string;
	text: string;
};

export type Section = "about" | "certs" | "projects" | "stack" | "streak";

export type ProfileConfig = {
	githubUser: string;
	theme: Theme;
	header: {
		name: string;
		role: string;
		// Shell prompt shown before each command, e.g. "sam@ashman:~$".
		prompt: string;
		windowTitle: string;
		roleCommand: string;
		headlinesCommand: string;
		headlines: string[];
		// Seconds each headline stays on screen.
		headlineSeconds: number;
		// Scrolling code on the left and right of the terminal.
		leftStream: string[];
		rightStream: string[];
	};
	linkedin: {
		url: string;
		label: string;
		handle: string;
		height: number;
	};
	codeRain: {
		positions: ("top" | "bottom")[];
		height: number;
		laneGap: number;
		seed: number;
		tokens: string[];
	};
	sectionOrder: Section[];
	headings: Record<Exclude<Section, "streak">, string>;
	about: AboutParagraph[];
	certs: Cert[];
	projects: Project[];
	stack: StackGroup[];
};
