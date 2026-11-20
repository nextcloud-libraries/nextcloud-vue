<?php

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Dumps the CSS variables of the default and the dark theme of the Nextcloud server.
// Used by `update-server-styles.mjs`, the theming app of the server is mocked like in its own tests.

use OCA\Theming\AppInfo\Application;
use OCA\Theming\ImageManager;
use OCA\Theming\Service\BackgroundService;
use OCA\Theming\Themes\DarkTheme;
use OCA\Theming\Themes\DefaultTheme;
use OCA\Theming\ThemingDefaults;
use OCA\Theming\Util;
use OCP\App\IAppManager;
use OCP\Files\IAppData;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUserSession;
use OCP\ServerVersion;
use PHPUnit\Framework\TestCase;

class DumpThemesTest extends TestCase {
	public function testDumpThemes(): void {
		$themingDefaults = $this->createMock(ThemingDefaults::class);
		$imageManager = $this->createMock(ImageManager::class);
		$config = $this->createMock(IConfig::class);
		$l10n = $this->createMock(IL10N::class);
		$appManager = $this->createMock(IAppManager::class);
		$urlGenerator = $this->createMock(IURLGenerator::class);
		$util = new Util($this->createMock(ServerVersion::class), $config, $appManager, $this->createMock(IAppData::class), $imageManager);

		// The default colors and background of Nextcloud
		foreach (['getColorPrimary', 'getDefaultColorPrimary', 'getColorBackground', 'getDefaultColorBackground'] as $method) {
			$themingDefaults->method($method)->willReturn('#00679e');
		}
		$themingDefaults->method('getBackground')->willReturnCallback(fn (bool $dark = false) => '/apps/' . Application::APP_ID . '/img/background/'
			. ($dark ? BackgroundService::SHIPPED_BACKGROUNDS[BackgroundService::DEFAULT_BACKGROUND_IMAGE]['dark_variant'] : BackgroundService::DEFAULT_BACKGROUND_IMAGE));
		$l10n->method('t')->willReturnCallback(fn ($text, $parameters = []) => vsprintf($text, $parameters));
		$urlGenerator->method('imagePath')->willReturnCallback(fn ($app = 'core', $filename = '') => "/$app/img/$filename");

		$themes = [];
		foreach (['default' => DefaultTheme::class, 'dark' => DarkTheme::class] as $name => $class) {
			$theme = new $class($util, $themingDefaults, $this->createMock(IUserSession::class), $urlGenerator, $imageManager, $config, $l10n, $appManager, null);
			$themes[$name] = $theme->getCSSVariables();
		}

		file_put_contents(getenv('THEMES_OUTPUT'), json_encode($themes));
		$this->assertNotEmpty($themes['dark']);
	}
}
