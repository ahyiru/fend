import {tools} from 'yrui';

const $storage=tools.$storage;

export const isAuth=()=>{
	return $storage.get('token')?true:false;;
};

export const getToken=()=>{
	return $storage.get('token');
};

export const setToken=(token)=>{
	$storage.set('token',token);
};

export const rmToken=()=>{
	$storage.rm('token');
};

export const getUser=()=>{
	return $storage.get('user');
};

export const setUser=(user)=>{
	$storage.set('user',user);
};

export const rmUser=()=>{
	$storage.rm('user');
};

export const clearAll=()=>{
	$storage.clear();
};


