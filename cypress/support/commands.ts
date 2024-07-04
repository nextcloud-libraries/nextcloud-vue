/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command'

import '@testing-library/cypress/add-commands'

addCompareSnapshotCommand()
