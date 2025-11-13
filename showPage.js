/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   showPage.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mfuente- <mfuente-@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/05 15:50:28 by mfuente-          #+#    #+#             */
/*   Updated: 2025/11/12 16:57:25 by mfuente-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

async function show(page){
    //const res = await fetch(page);
    //const html = await res.text();
    //app.innerHTML = html;
    const f = document.getElementById('app');
    f.src = page; // Establece el src del iframe
    
    f.onload = () => {
        f.contentWindow?.focus();
    };
    
    if (page === './html/index.html') {
        const script = document.createElement('script');
        script.src = 'pong_refactored.js';
        document.body.appendChild(script);
    }
}
//show('./html/menuContent.html');