/*******************************************************************************
 * Copyright (c) 2012 jantonio.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0
 * which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Contributors:
 *     jantonio - initial API and implementation
 ******************************************************************************/
package com.github.eduxes;

import android.os.Bundle;


import android.app.Activity;

import android.view.Menu;
import android.view.MenuItem;
import android.webkit.*;
import android.support.v4.app.NavUtils;

import org.apache.cordova.*;
public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        //setContentView(R.layout.activity_main);
    }

//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        getMenuInflater().inflate(R.menu.activity_main, menu);
//        return true;
//    }

    
}
